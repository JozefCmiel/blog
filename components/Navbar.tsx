

import Link from 'next/link';
import React, { useContext } from 'react';
import { UserContext } from '~/lib/context';

const Navbar = () => {
    const { user, username } = useContext(UserContext)

    return (
        <div className="navbar">
            <ul>
                <li>
                    <Link href="/">
                        <button className="btn-blue">FEED</button>
                    </Link>
                    </li>
                {username && (
                    <>
                        <li>
                            <Link href={`/${username}`} >
                                <img src={user?.photoURL} />
                            </Link>
                        </li>
                    </>
                )}
                {!username && (
                    <>
                        <li>
                            <Link href="/enter">
                                <button className="btn-blue">LOG IN</button>
                            </Link>
                        </li>
                    </>
                )}
            </ul>
        </div>
        )
}

export default Navbar;
;
