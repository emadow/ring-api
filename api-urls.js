'use strict'

const assign = require( 'lodash.assign' );
const LIST_ITEM_LIMIT = 75;

/*

    A path generator made out of strings with methods:

    let u = require('./api-paths')( {serverRoot: 'https://api.ring.com/clients_api'} );

    > u
        -> String 'https://api.ring.com/clients_api'

    > u.doorbots().device( {id: 'foo123'} )
        -> String 'https://api.ring.com/clients_api/doorbots/foo123']

    > u.doorbots().device( {id: 'foo123'} ).lightsOn()
        -> String 'https://api.ring.com/clients_api/doorbots/foo123/floodlight_light_on'

    > u.chimes().device( {id: 'chime2'} ).health()
        -> String 'https://api.ring.com/clients_api/chimes/chime2/health

*/
module.exports = bottle => bottle.service( 'apiUrls', apiUrls, 'options' )
function apiUrls( options ) {

    return assign( '' + options.serverRoot, {

        auth() {
            return 'https://oauth.ring.com/oauth/token'
        },

        session() {
            return `${this}/clients_api/session`
        },

        devices() {
            return `${this}/clients_api/ring_devices`
        },

        doorbots() {
            return assign( `${this}/clients_api/doorbots?limit=${LIST_ITEM_LIMIT}`, {

                device( device ) {
                    return assign( `${this}/${device.id}`, {

                        lightOn() {
                            return `${this}/floodlight_light_on`
                        },
                        lightOff() {
                            return `${this}/floodlight_light_off`
                        },
                        liveStream() {
                            return `${this}/vod`
                        },
                        health() {
                            return `${this}/health`
                        }
                    })
                },

                history() {
                    return `${this}/history?limit=${LIST_ITEM_LIMIT}`
                }
            })
        },

        dings() {
            return assign( `${this}/clients_api/dings?limit=${LIST_ITEM_LIMIT}`, {

                ding( ding ) {
                    return assign( `${this}/${ding.id}`, {

                        recording() {
                            return `${this}/recording?disable_redirect=true`
                        }
                    })
                },

                active({ burst = false } = { burst: false }) {
                    return `${this}/active?burst=${burst}`
                }
            })
        },

        chimes() {
            return assign( `${this}/clients_api/chimes?limit=${LIST_ITEM_LIMIT}`, {

                device( device ) {
                    return assign( `${this}/${device.id}`, {
                        health() {
                            return `${this}/health`
                        }
                    })
                },

            })
        }

    })
}
