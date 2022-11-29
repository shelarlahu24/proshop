import bcrypt from "bcryptjs";

const users = [
  {
    name: "Lahu Shelar",
    email: "lahu@gmail.com",
    password: bcrypt.hashSync('123123', 10),
    isAdmin: true
  },
  {
    name: "Dnyana Shelar",
    email: "dnyana@gmail.com",
    password: bcrypt.hashSync('123123', 10),
  },
  {
    name: "Sagar Shelar",
    email: "sagar@gmail.com",
    password: bcrypt.hashSync('123123', 10),
  }
]

export default users;