declare namespace React {
  interface HTMLAttributes<T> extends AriaAttributes, DOMAttributes<T> {
    agToken?: string;
  }
}
