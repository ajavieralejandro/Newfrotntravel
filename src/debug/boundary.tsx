import React from 'react';

type Props = { name?: string; children: React.ReactNode };
type State = { error?: Error };

export class Boundary extends React.Component<Props, State> {
  state: State = {};
  static getDerivedStateFromError(err: Error) { return { error: err }; }
  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error(`[Boundary:${this.props.name ?? 'root'}]`, error);
    console.log('[Component stack]\n' + info.componentStack);
  }
  render() {
    if (this.state.error) {
      return (
        <div style={{ padding: 12, background: '#fee', color: '#900' }}>
          Error en {this.props.name ?? 'root'}: {String(this.state.error)}
        </div>
      );
    }
    return this.props.children as any;
  }
}
