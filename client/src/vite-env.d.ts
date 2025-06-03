/// <reference types="vite/client" />

declare module 'react-signature-canvas' {
  import * as React from 'react';

  interface SignatureCanvasProps extends React.CanvasHTMLAttributes<HTMLCanvasElement> {
    canvasProps?: React.CanvasHTMLAttributes<HTMLCanvasElement>;
    clearOnResize?: boolean;
    minWidth?: number;
    maxWidth?: number;
    minDistance?: number;
    penColor?: string;
    velocityFilterWeight?: number;
    onBegin?: () => void;
    onEnd?: () => void;
  }

  export default class SignatureCanvas extends React.Component<SignatureCanvasProps> {
    clear: () => void;
    isEmpty: () => boolean;
    fromDataURL: (dataURL: string) => void;
    toDataURL: (type?: string, encoderOptions?: number) => string;
    getTrimmedCanvas: () => HTMLCanvasElement;
  }
}
