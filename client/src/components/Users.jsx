import { useState } from "react"

const Users = () => {
const [users, setUsers] = useState()


  return (
    <article>
        <h2>Users List</h2>
        {users?.length
            ? (
                <ul>
                    {users.map(iser, i)}
                </ul>
            )
        }
    </article>
  )
}

export default Users