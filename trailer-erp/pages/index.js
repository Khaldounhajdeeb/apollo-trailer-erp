import { useState } from "react";

export default function Home() {
  const [users, setUsers] = useState({
    admin: { password: "admin123", role: "admin" },
  });
  const [loggedIn, setLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [trailers, setTrailers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const [newUser, setNewUser] = useState({ username: "", password: "" });
  const [newTrailer, setNewTrailer] = useState({
    id: "",
    type: "",
    driver: "",
    requestDate: "",
    cost: "",
    paid: "Unpaid",
  });

  const handleLogin = () => {
    if (users[username] && users[username].password === password) {
      setLoggedIn(true);
      setIsAdmin(users[username].role === "admin");
    } else {
      alert("Invalid credentials!");
    }
  };

  const addUser = () => {
    if (!isAdmin) return alert("Only admin can add users!");
    setUsers({ ...users, [newUser.username]: { password: newUser.password, role: "user" } });
    setNewUser({ username: "", password: "" });
  };

  const removeUser = (user) => {
    if (!isAdmin) return alert("Only admin can remove users!");
    if (user === "admin") return alert("Admin cannot be removed!");
    const updatedUsers = { ...users };
    delete updatedUsers[user];
    setUsers(updatedUsers);
  };

  const resetPassword = (user) => {
    if (!isAdmin) return alert("Only admin can reset passwords!");
    const newPassword = prompt(`Enter a new password for ${user}:`);
    if (newPassword) {
      setUsers({ ...users, [user]: { ...users[user], password: newPassword } });
    }
  };

  const addTrailer = () => {
    setTrailers([...trailers, newTrailer]);
    setNewTrailer({ id: "", type: "", driver: "", requestDate: "", cost: "", paid: "Unpaid" });
  };

  const updateTrailerStatus = (index) => {
    if (!isAdmin) return alert("Only admin can edit entries!");
    const updatedTrailers = [...trailers];
    updatedTrailers[index].paid = updatedTrailers[index].paid === "Paid" ? "Unpaid" : "Paid";
    setTrailers(updatedTrailers);
  };

  const filteredTrailers = trailers.filter(trailer =>
    trailer.id.includes(searchQuery) || trailer.driver.includes(searchQuery)
  );

  if (!loggedIn) {
    return (
      <div>
        <h2>Login</h2>
        <input placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button onClick={handleLogin}>Login</button>
      </div>
    );
  }

  return (
    <div>
      <img src="/logo.png" alt="Company Logo" style={{ width: "200px", marginBottom: "20px" }} />
      <h1>Trailer ERP System</h1>

      {isAdmin && (
        <div>
          <h2>Admin Panel</h2>
          <input placeholder="New Username" value={newUser.username} onChange={(e) => setNewUser({ ...newUser, username: e.target.value })} />
          <input type="password" placeholder="New Password" value={newUser.password} onChange={(e) => setNewUser({ ...newUser, password: e.target.value })} />
          <button onClick={addUser}>Add User</button>

          <h3>Users List</h3>
          <ul>
            {Object.keys(users).map(user => (
              <li key={user}>
                {user} {user !== "admin" && (
                  <>
                    <button onClick={() => removeUser(user)}>Remove</button>
                    <button onClick={() => resetPassword(user)}>Reset Password</button>
                  </>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      <h2>Add New Trailer Entry</h2>
      <input placeholder="Trailer ID" value={newTrailer.id} onChange={(e) => setNewTrailer({ ...newTrailer, id: e.target.value })} />
      <input placeholder="Trailer Type" value={newTrailer.type} onChange={(e) => setNewTrailer({ ...newTrailer, type: e.target.value })} />
      <input placeholder="Driver Name" value={newTrailer.driver} onChange={(e) => setNewTrailer({ ...newTrailer, driver: e.target.value })} />
      <input type="date" value={newTrailer.requestDate} onChange={(e) => setNewTrailer({ ...newTrailer, requestDate: e.target.value })} />
      <input placeholder="Maintenance Cost" value={newTrailer.cost} onChange={(e) => setNewTrailer({ ...newTrailer, cost: e.target.value })} />
      <button onClick={addTrailer}>Add Trailer</button>

      <h2>Search Entries</h2>
      <input placeholder="Search by Trailer ID or Driver" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />

      <h2>Trailer Entries</h2>
      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>Trailer ID</th>
            <th>Type</th>
            <th>Driver</th>
            <th>Request Date</th>
            <th>Cost</th>
            <th>Paid Status</th>
            {isAdmin && <th>Action</th>}
          </tr>
        </thead>
        <tbody>
          {filteredTrailers.map((trailer, index) => (
            <tr key={index}>
              <td>{trailer.id}</td>
              <td>{trailer.type}</td>
              <td>{trailer.driver}</td>
              <td>{trailer.requestDate}</td>
              <td>{trailer.cost}</td>
              <td>{trailer.paid}</td>
              {isAdmin && <td><button onClick={() => updateTrailerStatus(index)}>Toggle Paid</button></td>}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
