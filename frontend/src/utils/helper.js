export const validateEmail = (email) =>{
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email)
}

export const getInitials = (name)=>{
    if(!name) return "";
    const  words = name.split(" ")
    let initials = ""
    for(let i = 0; i<Math.min(words.length,2);i++){
        initials+= words[i][0]
    }
    return initials.toUpperCase()
}


export const getEmptyCardMessage = (filterType) => {
    switch (filterType) {
        case "search":
            return `Oops!No search results found`
        case "date":
            return `No stories found for the selected date range`
        default:
            return `Start creating your first travel story! Click on the 'ADD' button to write down your thoughts, ideas and memories.`
    }
}