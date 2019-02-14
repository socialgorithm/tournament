import * as PubSubJS from 'pubsub-js';

/**
 * Any class that wants to use the PubSub bus needs to extend this class.
 * No one should use PubSub directly!!
 */
export default class PubSub {
    private subscriptionTokens: Array<string> = [];

    public publish(event: string, data: any) {
        PubSubJS.publish(event, data);
    }

    public publishNamespaced(namespace: string, event: string, data: any) {
        this.publish(this.makeNamespace(namespace, event), data);
    }

    public subscribeNamespaced(namespace: string, event: string, fn: Function) {
        this.subscribe(this.makeNamespace(namespace, event), fn);
    }

    public subscribe(event: string, fn: Function): void {
        const token = PubSubJS.subscribe(event, (event: string, data: any) => fn(data));
        this.subscriptionTokens.push(token);
    }

    public unsubscribeAll() {
        this.subscriptionTokens.forEach(token => {
            PubSubJS.unsubscribe(token);
        });
    }

    private makeNamespace(namespace: string, event: string): string {
        return `${event}--${namespace}`;
    }
}