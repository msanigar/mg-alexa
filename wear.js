module.exports = {
    getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    },
    getWearByPerson(Person) {
        if (Person && Person.value) {
            const clothes = clothesPool[this.getRandomInt(0, clothesPool.length + 1)];
            return {
                speak: Person.value.toLowerCase() + ' was wearing missguided\'s ' + clothes.name + 'want me to add it your wishlist?',
                reprompt: clothes.name,
                image: clothes.image,
            };
        } else {
            return {
                speak: 'Who you like to ask?',
                repromopt: 'Tell me a name'
            };
        }
    }
}

const clothesPool = [
    {
        name:'white cold shoulder polka dot shirt dress',
        url:'https://www.missguided.co.uk/white-cold-shoulder-polka-dot-shirt-dress-10089626',
        image:'https://media.missguided.com/s/missguided/DD913646_set/1/white-cold-shoulder-polka-dot-shirt-dress.jpg?$product-page__zoom--1x$'
    },
    {
        name:'white printed flared sleeve dress',
        url:'https://www.missguided.co.uk/white-printed-flared-sleeve-dress-10104690',
        image:'https://media.missguided.com/s/missguided/DD915417_set/1/white-printed-flared-sleeve-dress.jpg?$product-page__zoom--1x$'
    },
    {
        name:'blue tie front button down midi dress',
        url:'https://www.missguided.co.uk/blue-tie-front-button-down-midi-dress-10097342',
        image:'https://media.missguided.com/s/missguided/DD914649_set/1/blue-tie-front-button-down-midi-dress.jpg?$product-page__zoom--1x$'
    },
    {
        name:'bluered flared sleeve ladder trim dress',
        url:'httpshttps://www.missguided.co.uk/red-flared-sleeve-ladder-trim-dress-10062988',
        image:'https://media.missguided.com/s/missguided/DD911844_set/1/red-flared-sleeve-ladder-trim-dress.jpg?$product-page__zoom--1x$'
    },
]
