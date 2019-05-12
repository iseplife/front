import React from 'react';
import { SECONDARY_COLOR } from '../colors';

export type CancelablePromise = {
  promise: Promise<any>;
  cancel: () => void;
};
export const makeCancelable = (promise: Promise<any>): CancelablePromise => {
  let hasCanceled_ = false;

  const wrappedPromise = new Promise((resolve, reject) => {
    promise.then(
      val => (hasCanceled_ ? reject({ isCanceled: true }) : resolve(val)),
      error => (hasCanceled_ ? reject({ isCanceled: true }) : reject(error))
    );
  });

  return {
    promise: wrappedPromise,
    cancel() {
      hasCanceled_ = true;
    },
  };
};

/**
 * Parse the text to find items like links
 * and transform them into components
 */
export function parseText(text: string) {
  const words = text.split(' ');
  const linkStyle: React.CSSProperties = {
    color: SECONDARY_COLOR,
    textDecoration: 'underline',
    fontWeight: 'bold',
  };
  return words.map((word, i) => {
    const sep = i < words.length - 1 ? ' ' : '';
    if (word.match(/^https?:\//)) {
      return [
        <a key={i} href={word} target="_blank" style={linkStyle}>
          {word}
        </a>,
        sep,
      ];
    } else {
      return word + sep;
    }
  });
}
