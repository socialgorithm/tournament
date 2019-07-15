import { Events as PubSubEvents } from "./Events";
export default class PubSub {
    private subscriptionTokens;
    publish(event: PubSubEvents, data: any): void;
    publishNamespaced(namespace: string, event: PubSubEvents, data: any): void;
    subscribeNamespaced(namespace: string, event: PubSubEvents, fn: (data: any) => void): void;
    subscribe(event: PubSubEvents, fn: (data: any) => void): void;
    unsubscribeAll(): void;
    private makeNamespace;
}
