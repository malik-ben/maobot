a = [{ name: "ma", age: 1 }, { name: "yo", age: "3" }, { name: "qw", age: "31" }]

b = [{ name: "yo", age: "3" }]

c = a.filter((formA) => {
return !b.find((formB)=>{
    return formA.name === formB.name
})
})
console.log(Math.floor(Date.now() / 1000))


