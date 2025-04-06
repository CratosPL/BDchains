import Principal "mo:base/Principal";
import HashMap "mo:base/HashMap";
import Text "mo:base/Text";
import Option "mo:base/Option";

actor {
  type User = {
    principal: Principal;
    username: ?Text;
    avatarUrl: ?Text;
    hasAccount: Bool;
    usernameChanges: Nat;
    role: Text;
  };

  let users = HashMap.HashMap<Principal, User>(10, Principal.equal, Principal.hash);

  public shared(msg) func register(username: Text, avatarUrl: ?Text) : async Bool {
    let caller = msg.caller;
    switch (users.get(caller)) {
      case (?existingUser) { return false; }; // Użytkownik już istnieje
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