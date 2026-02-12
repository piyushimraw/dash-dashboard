// Create this file if it doesn't exist already

import '@tanstack/react-table';

declare module '@tanstack/react-table' {
  interface ColumnMeta {
    className?: string;
    forceArrow?: boolean;
    hasLink?: boolean;
    disableHighlight?: boolean;
    onClick?: () => void;
  }
}
