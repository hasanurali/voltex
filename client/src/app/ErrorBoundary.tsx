import { Component, type ErrorInfo, type ReactNode } from 'react';
import { ErrorFallback } from "@/components";

interface Props {
    children: ReactNode;
};

interface State {
    hasError: boolean;
};

export class ErrorBoundary extends Component<Props, State> {

    state: State = {
        hasError: false
    };

    static getDerivedStateFromError(): State {
        return {
            hasError: true
        };
    };

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Uncaught error:', error, errorInfo);
    };

    render() {

        if (this.state.hasError) {
            return <ErrorFallback />
        };

        return this.props.children;
    }
};