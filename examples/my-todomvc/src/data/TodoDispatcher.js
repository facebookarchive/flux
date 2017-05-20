import {Dispatcher} from 'flux';

// Dispatcher, as per Flux docs, is a singleton that will receive updates
// via actions from UI or elsewhere and then push changes to
// stores; these will then emit change events for UI to listen
// to

// we are making a new Dispatcher representing our Todo setup
// and we only need one, so the only thing we do here is send
// it out

export default new Dispatcher();