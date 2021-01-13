const express = require('express');
const morgan = require('morgan');
const app = express();
app.use(morgan('dev'));

app.get('/', (req, res) => {
    res.send('Hello Express!');
});

app.get('/echo', (req, res) => {
    const responseText = `Here are some details of your request: 
        Base URL: ${req.baseUrl}
        Host: ${req.hostname}
        Path: ${req.path}
        `;
        res.send(responseText)
})

app.get('/queryViewer', (req, res) => {
    console.log(req.query);
    res.end(); // do not send any data back to the client
})

app.get('/greetings', (req, res) => {
    const name = req.query.name;
    const race = req.query.race;

    if(!name) {
        return res.status(400).send('Please provide a name');
    }

    if(!race) {
        return res.status(400).send('Please provide a race');
    }

    const greeting = `Greetings ${name} the ${race}, welcome to the shire.`;
    res.send(greeting);
})

app.get('/sum', (req, res) => {
    const a = parseInt(req.query.a);
    const b = parseInt(req.query.b);
    const sum = a + b;
    
    const responseText = `The sum of ${a} and ${b} is ${sum}.`
    res.send(responseText)

})

app.get('/cipher', (req, res) => {
    const text = req.query.text.toUpperCase().split('');
    const shift = parseInt(req.query.shift);
    let newWordArray = [];

    text.forEach(letter => {
        const charCode = letter.charCodeAt(0)
        let newCharCode = charCode + shift;
        if(newCharCode > 90) {
            let remainder = newCharCode - 90;
            newCharCode = 64 + remainder;
        }
        const newLetter = String.fromCharCode(newCharCode)
        newWordArray.push(newLetter)
    });
    const cipher = newWordArray.join('')
    res.send(cipher)
})

app.get('/lotto', (req, res) => {
    const { numbers } = req.query; 
  
    // validation: 
    // 1. the numbers array must exist
    // 2. must be an array
    // 3. must be 6 numbers
    // 4. numbers must be between 1 and 20
  
    if(!numbers) {
      return res
        .status(400)
        .send("numbers is required");
    }
  
    if(!Array.isArray(numbers)) {
      return res
        .status(400)
        .send("numbers must be an array");
    }
  
    const guesses = numbers
          .map(n => parseInt(n))
          .filter(n => !Number.isNaN(n) && (n >= 1 && n <= 20));
    
    if(guesses.length != 6) {
      return res
        .status(400)
        .send("numbers must contain 6 integers between 1 and 20");
    }      
  
    // fully validated numbers
  
    // here are the 20 numbers to choose from
    const stockNumbers = Array(20).fill(1).map((_, i) => i + 1);
  
    //randomly choose 6
    const winningNumbers = [];
    for(let i = 0; i < 6; i++) {
      const ran = Math.floor(Math.random() * stockNumbers.length);
      winningNumbers.push(stockNumbers[ran]);
      stockNumbers.splice(ran, 1);
    }
  
    //compare the guesses to the winning number
    let diff = winningNumbers.filter(n => !guesses.includes(n));
  
    // construct a response
    let responseText;
  
    switch(diff.length){
      case 0: 
        responseText = 'Wow! Unbelievable! You could have won the mega millions!';
        break;
      case 1:   
        responseText = 'Congratulations! You win $100!';
        break;
      case 2:
        responseText = 'Congratulations, you win a free ticket!';
        break;
      default:
        responseText = 'Sorry, you lose';  
    }
  
  
    // uncomment below to see how the results ran
  
    // res.json({
    //   guesses,
    //   winningNumbers,
    //   diff,
    //   responseText
    // });
  
    res.send(responseText);
});

app.get('/hello', (req, res) => {
    res
        .status(204)
        .end()
})

app.get('/video', (req, res) =>{
    const video = {
        title: 'Cats falling over',
        description: '15 minutes of cats falling',
        length: '15.40'
    }
    res.json(video)
})

app.get('/colors', (req, res) => {
    const colors = [
        {
            name: "red",
            rgb: "FF0000"
        },
        {
            name: "green",
            rgb: "00FF00"
        },
        {
            name: "blue",
            rgb: "0000FF"
        },
    ];
    res.json(colors)
})

app.get('/grade', (req, res) => {
    const { mark } = req.query;

    if(!mark) {
        return res
        .status(400)
        .send('Please provide a mark')
    }

    const numericMark = parseFloat(mark);
    if (Number.isNaN(numericMark)) {
        return res
        .status(400)
        .send('Mark must be a numeric value')
    }

    if (numericMark < 0 || numericMark > 100) {
        return res
        .status(400)
        .send('Mark must be in range 0 to 100')
    }

    if (numericMark >= 90) {
        return res.send('A');
    }
    
    if (numericMark >= 80) {
        return res.send('B');
    }
    
    if (numericMark >= 70) {
        return res.send('C');
    }
    
    res.send('F');
})
  

app.listen(8000, () => {
    console.log('Express server is listening on port 8000!');
});

