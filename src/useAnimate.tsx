import { useRef, useEffect, useState, useCallback } from 'react'

interface UseAnimateOptions extends KeyframeAnimationOptions {
  immediate?: boolean
  commitStyles?: boolean
  persist?: boolean
  onReady?: (animate: Animation) => void
  onError?: (error: unknown) => void
}

type UseAnimateKeyframes = Keyframe[] | PropertyIndexedKeyframes | null

interface UseAnimateReturn {
  isSupported: boolean
  animate: Animation | undefined
  play: () => void
  pause: () => void
  reverse: () => void
  finish: () => void
  cancel: () => void
  pending: boolean
  playState: AnimationPlayState
  replaceState: AnimationReplaceState
  startTime: number | null
  setStartTime: (time: number | null) => void
  currentTime: number | null
  setCurrentTime: (time: number | null) => void
  timeline: AnimationTimeline | null
  setTimeline: (timeline: AnimationTimeline | null) => void
  playbackRate: number
  setPlaybackRate: (rate: number) => void
}

export default function useAnimate(
  target: React.RefObject<HTMLElement>,
  keyframes: UseAnimateKeyframes,
  options?: number | UseAnimateOptions
): UseAnimateReturn {
  const config =
    typeof options === 'object' ? { ...options } : { duration: options }

  const {
    immediate = true,
    commitStyles = false,
    persist = false,
    onReady,
    onError = (e: unknown) => console.error(e),
    ...animateOptions
  } = config

  const isSupported =
    typeof window !== 'undefined' &&
    typeof HTMLElement !== 'undefined' &&
    'animate' in HTMLElement.prototype

  const animateRef = useRef<Animation | null>(null)
  const [pending, setPending] = useState(false)
  const [playState, setPlayState] = useState<AnimationPlayState>('idle')
  const [replaceState, setReplaceState] =
    useState<AnimationReplaceState>('active')
  const [startTime, setStartTime] = useState<number | null>(null)
  const [currentTime, setCurrentTime] = useState<number | null>(null)
  const [timeline, setTimeline] = useState<AnimationTimeline | null>(null)
  const [playbackRate, setPlaybackRate] = useState(1)

  const updateAnimationState = useCallback(() => {
    if (!animateRef.current) return

    setPending(animateRef.current.pending)
    setPlayState(animateRef.current.playState)
    setReplaceState(animateRef.current.replaceState)
    setStartTime(Number(animateRef.current.startTime))
    setCurrentTime(Number(animateRef.current.currentTime))
    setTimeline(animateRef.current.timeline)
    setPlaybackRate(animateRef.current.playbackRate)
  }, [])

  const createAnimation = useCallback(() => {
    if (!isSupported || !target.current) return null

    // Cancel existing animation if any
    if (animateRef.current) {
      animateRef.current.cancel()
    }

    // Create new animation
    const animation = target.current.animate(keyframes, {
      ...animateOptions,
      fill: 'both',
      iterations: animateOptions.iterations ?? 1,
      easing: animateOptions.easing ?? 'linear',
    })

    animateRef.current = animation

    if (persist) {
      animation.persist()
    }

    if (playbackRate !== 1) {
      animation.playbackRate = playbackRate
    }

    // Always pause the animation initially
    animation.pause()

    if (immediate) {
      animation.play()
    }

    // Event listeners
    const updateState = () => {
      requestAnimationFrame(updateAnimationState)
    }
    animation.addEventListener('finish', updateState)
    animation.addEventListener('cancel', updateState)
    animation.addEventListener('remove', updateState)

    onReady?.(animation)
    updateState()

    console.log('Animation created, playState:', animation.playState)
    return animation
  }, [
    isSupported,
    target,
    keyframes,
    animateOptions,
    persist,
    playbackRate,
    immediate,
    onReady,
    updateAnimationState,
  ])

  // Initialize animation
  // useEffect(() => {
  //   createAnimation()
  //   return () => {
  //     if (animateRef.current) {
  //       animateRef.current.cancel()
  //       animateRef.current = null
  //     }
  //   }
  // }, [createAnimation])

  // Play - Start or resume the animation
  const play = useCallback(() => {
    console.log('Play called, animation exists:', !!animateRef.current)
    try {
      if (!animateRef.current) {
        const animation = createAnimation()
        if (animation) {
          animation.play()
          console.log('New animation created and played')
        }
      } else {
        animateRef.current.play()
        console.log('Existing animation played')
      }
      updateAnimationState()
      console.log('After play, playState:', animateRef.current?.playState)
    } catch (e) {
      console.error('Error in play:', e)
      onError(e)
    }
  }, [createAnimation, onError, updateAnimationState])

  // Pause - Freeze the animation in its current state
  const pause = useCallback(() => {
    console.log('Pause called, animation exists:', !!animateRef.current)
    try {
      if (!animateRef.current) {
        const animation = createAnimation()
        if (animation) {
          animation.pause()
          console.log('New animation created and paused')
        }
      } else {
        animateRef.current.pause()
        const animation = createAnimation()
        if (animation) {
          animation.pause()
          console.log('New animation created and paused')
        }
        console.log('Existing animation paused')
      }
      updateAnimationState()
    } catch (e) {
      console.error('Error in pause:', e)
      onError(e)
    }
  }, [createAnimation, onError, updateAnimationState])

  // Reverse - Change animation direction
  const reverse = useCallback(() => {
    try {
      if (!animateRef.current) {
        const animation = createAnimation()
        if (animation) {
          if (animation.playbackRate) {
            animation.playbackRate *= -1
          }
          animation.reverse()
        }
      } else {
        animateRef.current!.playbackRate *= -1
        animateRef.current!.reverse()
      }
      updateAnimationState()
    } catch (e) {
      onError(e)
    }
  }, [createAnimation, onError, updateAnimationState])

  // Finish - Jump to end state and stop
  const finish = useCallback(() => {
    try {
      if (animateRef.current) {
        if (
          animateRef.current.effect &&
          animateRef.current.effect.getTiming().iterations ===
            Number.POSITIVE_INFINITY
        ) {
          // For infinite animations, set currentTime to the end of one iteration
          const duration = animateRef.current.effect.getTiming()
            .duration as number
          animateRef.current.currentTime = duration
        } else {
          animateRef.current.finish()
        }
        updateAnimationState()
      }
    } catch (e) {
      onError(e)
    }
  }, [onError, updateAnimationState])

  // Cancel - Remove animation and return to start state
  const cancel = useCallback(() => {
    try {
      if (animateRef.current) {
        animateRef.current.cancel()
        animateRef.current = null
        updateAnimationState()
      }
    } catch (e) {
      onError(e)
    }
  }, [onError, updateAnimationState])

  // Update animation properties
  useEffect(() => {
    const animation = animateRef.current
    if (!animation) return

    try {
      if (startTime !== null) animation.startTime = startTime
      if (currentTime !== null) animation.currentTime = currentTime
      if (timeline !== null) animation.timeline = timeline
      if (playbackRate !== animation.playbackRate)
        animation.playbackRate = playbackRate

      updateAnimationState()
    } catch (e) {
      onError(e)
    }
  }, [
    startTime,
    currentTime,
    timeline,
    playbackRate,
    onError,
    updateAnimationState,
  ])

  return {
    isSupported,
    animate: animateRef.current ?? undefined,
    play,
    pause,
    reverse,
    finish,
    cancel,
    pending,
    playState,
    replaceState,
    startTime,
    setStartTime,
    currentTime,
    setCurrentTime,
    timeline,
    setTimeline,
    playbackRate,
    setPlaybackRate,
  }
}
