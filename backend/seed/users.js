import bcrypt from 'bcrypt';

const usuarios = [
    {
        name: "Remy",
        lastname: "Patgher",
        email: "correo@correo.com",
        password: bcrypt.hashSync('Password3$', 10),
        phone: "5545497970",
        role: "Admin",
        confirmed: 1
    },
    {
        name: "Diego",
        lastname: "Lopez Araiza",
        email: "correo2@correo.com",
        password: bcrypt.hashSync('Password3$', 10),
        phone: "5543456543",
        role: "Admin",
        confirmed: 1
    },
    {
        name: "Joseph",
        lastname: "Shakalo",
        email: "correo3@correo.com",
        password: bcrypt.hashSync('Password3$', 10),
        phone: "5534432222",
        role: "Admin",
        confirmed: 1
    },
    {
        name: "Isaac",
        lastname: "Shakalo",
        email: "correo4@correo.com",
        password: bcrypt.hashSync('Password3$', 10),
        phone: "5532321111",
        role: "Admin",
        confirmed: 1
    }
];


export default usuarios;