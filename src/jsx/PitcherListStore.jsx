import {EventEmitter} from 'events';
import _ from 'lodash';


let PitcherListStore = _.extend({}, EventEmitter.prototype, {

    // Mock default data
    mockPitchers: [
        {
            pitcher_100001000: {
                projections: {},
                details: {}
            }
        },
        {
            pitcher_100002000: {
                projections: {},
                details: {}
            }
        }
    ],

    // Get all items
    getPitchers: function(){
        return this.items;
    },

    // Add item
    addPitcher: function(new_item){
        this.items.push(new_item);
    },

    // Remove item
    removePitcher: function(item_id){

        let items = this.items;

        _.remove(items,(item) => {
            return item_id == item.id;
        });

        this.items = items;

    },

    // Emit Change event
    emitChange: function(){
        this.emit('change');
    },

    // Add change listener
    addChangeListener: function(callback){
        this.on('change', callback);
    },

    // Remove change listener
    removeChangeListener: function(callback) {
        this.removeListener('change', callback);
    }

});

export default PitcherListStore;