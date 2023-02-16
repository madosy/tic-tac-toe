export default class Pubsub {
    constructor() {
        this.events = {}
    }

    subscription (eventName, func) {
        return {
            subscribe: () => {
                if (this.events[eventName]) {
                    this.events[eventName].push(func)
                    console.log(`${func.name} has subscribed to ${eventName} Topic!`)
                } else {
                    this.events[eventName] = [func];
                    console.log(`${func.name} has subscribed to ${eventName} Topic!`)
                }
            },

            unsubscribe: () => {
                if (this.events[eventName]) {
                    this.events[eventName] = this.events[eventName].filter(subscriber => subscriber != func)
                    console.log(`${func.name} has unsubscribed from ${eventName} Topic!`)
                }
            },
        }
    }

    publish (eventName, ...args) {
        if (this.events[eventName]){
            const funcs = this.events[eventName]
            funcs.forEach((func) => {
                func.apply(null, [...args])
            })
        }
    }
}