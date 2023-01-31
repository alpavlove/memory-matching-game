import classNames from 'classnames'
import React from 'react'

type CardProps = {
  emoji: string
  isGameOver: boolean
  isVisible: boolean
  handleCardClick(): void
}

export function Card({ emoji, isGameOver, isVisible, handleCardClick }: CardProps) {
  return (
    <div
      data-testid="card-wrapper"
      className={classNames(
        'w-[20vw] h-[20vw] sm:w-32 sm:h-32 bg-amber-200 rounded-lg overflow-hidden shadow-md transform transform-gpu transition duration-500 ease-linear',
        {
          'cursor-pointer': !isGameOver,
          'flip': !isVisible,
        },
      )}
      onClick={!isGameOver && !isVisible ? () => handleCardClick() : undefined}
    >
      <div
        data-testid="card"
        className={classNames(
          'flex w-full h-full items-center justify-center transform transform-gpu transition ease-linear',
          {
            'opacity-100 duration-250 delay-250': isVisible,
            'opacity-0 duration-250 delay-0': !isVisible,
          },
        )}
      >
        <span className="text-center text-5xl sm:text-7xl text-gray-800 p-4">{emoji}</span>
      </div>
    </div>
  )
}
