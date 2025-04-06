import Principal "mo:base/Principal";
import HashMap "mo:base/HashMap";
import Text "mo:base/Text";
import Option "mo:base/Option";
import Iter "mo:base/Iter";

actor {
  type User = {
    principal: Principal;
    username: ?Text;
    avatarUrl: ?Text;
    hasAccount: Bool;
    usernameChanges: Nat;
    role: Text;
  };

  // Stabilna pamięć dla HashMap
  stable var usersEntries : [(Principal, User)] = [];
  var users = HashMap.HashMap<Principal, User>(10, Principal.equal, Principal.hash);

  // Zapis stanu przed aktualizacją
  system func preupgrade() {
    usersEntries := Iter.toArray(users.entries());
  };

  // Odtworzenie stanu po aktualizacji
  system func postupgrade() {
    users := HashMap.fromIter<Principal, User>(usersEntries.vals(), 10, Principal.equal, Principal.hash);
    usersEntries := [];
  };

  public shared(msg) func register(username: Text, avatarUrl: ?Text) : async Bool {
    let caller = msg.caller;
    switch (users.get(caller)) {
      case (?_) { return false; }; // Użytkownik już istnieje, zmieniono na `_`
      case null {
        let newUser: User = {
          principal = caller;
          username = ?username;
          avatarUrl = avatarUrl;
          hasAccount = true;
          usernameChanges = 0;
          role = "USER";
        };
        users.put(caller, newUser);
        return true;
      };
    };
  };

  public shared query(msg) func getUser() : async ?User {
    users.get(msg.caller);
  };

  public shared query(msg) func isRegistered() : async Bool {
    Option.isSome(users.get(msg.caller));
  };

  public shared(msg) func updateUser(username: Text, avatarUrl: ?Text) : async Bool {
    switch (users.get(msg.caller)) {
      case (?user) {
        let updatedUser: User = {
          principal = user.principal;
          username = ?username;
          avatarUrl = avatarUrl;
          hasAccount = user.hasAccount;
          usernameChanges = user.usernameChanges + 1;
          role = user.role;
        };
        users.put(msg.caller, updatedUser);
        return true;
      };
      case null { return false; };
    };
  };
};