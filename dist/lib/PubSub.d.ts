export default class PubSub {
    private subscriptionTokens;
    publish(event: string, data: any): void;
    publishNamespaced(namespace: string, event: string, data: any): void;
    subscribeNamespaced(namespace: string, event: string, fn: Function): void;
    subscribe(event: string, fn: Function): void;
    unsubscribeAll(): void;
    private makeNamespace;
}
