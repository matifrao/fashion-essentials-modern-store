/*==========================================================
  NexPage Commerce Platform

  File: event-bus.js
  Description: Global Event Bus

  Version: 1.0.0

  Copyright © NexPage. All Rights Reserved.
==========================================================*/

class EventBus {

    constructor() {

        this.events = new Map();

    }

    /*======================================================
      Subscribe
    ======================================================*/

    on(event, callback) {

        if (!this.events.has(event)) {

            this.events.set(event, []);

        }

        this.events.get(event).push(callback);

    }

    /*======================================================
      Subscribe Once
    ======================================================*/

    once(event, callback) {

        const wrapper = payload => {

            callback(payload);

            this.off(event, wrapper);

        };

        this.on(event, wrapper);

    }

    /*======================================================
      Unsubscribe
    ======================================================*/

    off(event, callback) {

        if (!this.events.has(event)) {

            return;

        }

        const listeners = this.events.get(event);

        this.events.set(

            event,

            listeners.filter(listener => listener !== callback)

        );

    }

    /*======================================================
      Emit Event
    ======================================================*/

    emit(event, payload = null) {

        if (!this.events.has(event)) {

            return;

        }

        this.events

            .get(event)

            .forEach(listener => {

                try {

                    listener(payload);

                }

                catch (error) {

                    console.error(

                        `EventBus Error [${event}]`,

                        error

                    );

                }

            });

    }

    /*======================================================
      Clear Event
    ======================================================*/

    clear(event) {

        this.events.delete(event);

    }

    /*======================================================
      Clear All
    ======================================================*/

    clearAll() {

        this.events.clear();

    }

    /*======================================================
      Count Listeners
    ======================================================*/

    listenerCount(event) {

        if (!this.events.has(event)) {

            return 0;

        }

        return this.events.get(event).length;

    }

}

export default new EventBus();