import Array "mo:base/Array";
import HashMap "mo:base/HashMap";
import Iter "mo:base/Iter";
import Float "mo:base/Float";
import Text "mo:base/Text";

actor FoodRating {
    public type Store = {
        name: Text;
        rating: Float;
        imageUrl: Text;
    };

    private stable var storeEntries : [(Text, Store)] = [];
    private var stores = HashMap.HashMap<Text, Store>(0, Text.equal, Text.hash);

    public func createStore(name : Text, imageUrl : Text) : async () {
        let newStore : Store = {
            name = name;
            rating = 0.0; // Default rating as Float
            imageUrl = imageUrl;
        };
        stores.put(name, newStore);
    };

    public query func getStore(name : Text) : async ?Store {
        stores.get(name)
    };

    public func updateStore(name : Text, newRating : Float) : async () {
        switch (stores.get(name)) {
            case (null) {
                // Store doesn't exist, do nothing
            };
            case (?store) {
                let updatedStore : Store = {
                    name = store.name;
                    rating = newRating;
                    imageUrl = store.imageUrl;
                };
                stores.put(name, updatedStore);
            };
        };
    };

    public query func getAllStores() : async [Store] {
        Iter.toArray(stores.vals())
    };

    public func deleteStore(name : Text) : async Bool {
        switch (stores.remove(name)) {
            case (null) { false };
            case (?_) { true };
        };
    };

    system func preupgrade() {
        storeEntries := Iter.toArray(stores.entries());
    };

    system func postupgrade() {
        stores := HashMap.fromIter<Text, Store>(storeEntries.vals(), 0, Text.equal, Text.hash);
    };
}
