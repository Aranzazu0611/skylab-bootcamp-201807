import React from 'react'

function Landing({ onRegister, onLogin }) {
    return <section>
        <button className="btn btn-lg btn-success" onClick={onRegister}>Register</button> or <button className="btn btn-lg btn-success" onClick={onLogin}>Login</button>
    </section>
}

export default Landing