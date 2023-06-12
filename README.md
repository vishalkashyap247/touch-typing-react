# deployed link : https://touch-typing-react.netlify.app/
Touch-typing-react is a simple website to learn touch typing
### What is touch typing?
Touch typing is a method of typing on a keyboard where the typist uses all fingers and types without looking at the keys. It involves placing your fingers on a specific position, known as the home row, and using the correct finger to press each key. 

### Why touch typing?
Touch typing allows for faster and more efficient typing because it relies on muscle memory and the ability to locate keys by touch rather than by visually searching for them.

### Homepage
![Screenshot (748)](https://github.com/vishalkashyap247/touch-typing-react/assets/103761502/819d6bed-cc9f-4649-b71a-09d4b92dca08)

This is the home page in my website\
We have two options
- Difficulty
- Time duration
### About Difficulty
It has 4 difficulty and all 4 are super exciting,
- In easy mode you can see the keys are in black colour initially after typing in the textbox the word is highlighted in either red or green, if word colour is red then the typed word is wrongly typed and if green then typed word is correctly typed, and this is how easy works, its easy to use for beginners easy mode is recommended,
- In medium mode, word is highlighted in blue colour and you are suppose to type that word in textbox and hit space button so in this mode user need to verify the word by own that whether the typed word is correct or not
- In hard mode there is no colour visualization all words are in same colour ie black this mode is specially for those who are pro in touch typing also this mode is also dedicated to remembering so if you want to check both skills ie touch typing and remembering so this mode is for you only so go and checkit out
- And our last difficulty mode ie different1 its like hard++, means all features of hard is applicable here but it comes with a twist that user wont able to see the words which they are styping so user need to take extra precautions to type words i think this mode really defines touch typing concept so challenge your friends to beat in touch typing.

### glimpse of difficluty level
- easy
![image](https://github.com/vishalkashyap247/touch-typing-react/assets/103761502/0e79d945-a7bc-4364-bbf6-13bec4cc9f86)
 you can see the word which is typed is highlighted in the green colour.
 
 - medium
 ![image](https://github.com/vishalkashyap247/touch-typing-react/assets/103761502/06851620-b02b-4a87-bf9d-0a30e5a419b6)
word is highlighted in blue colour which you are suppose to type or still typing.

- hard
![image](https://github.com/vishalkashyap247/touch-typing-react/assets/103761502/8b302ced-ebc5-431e-aa70-2c0ca7f59d26)
word is not highlighted so user need to pay attention to the words. remember the about difficulty para.

- different1
![image](https://github.com/vishalkashyap247/touch-typing-react/assets/103761502/2a1c08f4-0006-4a50-9a73-68211c516412)
this is like hard++, user wont able to see the words which they are typing

### Time duration
we have two options, 1min timer and 5min timer so user can select time as their convenient no issues

### Result section
![image](https://github.com/vishalkashyap247/touch-typing-react/assets/103761502/afc8535f-05eb-428c-bdc6-47b37023c9fe)
here you can check your Words per minute count, accuracy percentage and words which are typed in two colours Red and Green red means you have typed wrong and green means you have typed it correctly and you can also check given string there.
This result section is remain same for all difficulty and time duration mode so user can analyse better and improve

## Code explanation
First I am generating the words which user are suppose to type, Since Requirement is for asdfjkl; letter contains word so I genrate using my own function 
```js
function generateWords() {
    const validChars = ["a", "s", "d", "f", "j", "k", "l"];
    const semicolonFrequency = 0.3;
    const minLength = 3;
    const maxLength = 5;
    const minWords = 170;

    const words = [];

    while (words.length < minWords) {
      const wordLength =
        Math.floor(Math.random() * (maxLength - minLength + 1)) + minLength;
      let word = "";
      let hasSemicolon = Math.random() < semicolonFrequency;

      for (let i = 0; i < wordLength; i++) {
        if (i === 3 && hasSemicolon) {
          word += ";";
        } else {
          word += validChars[Math.floor(Math.random() * validChars.length)];
        }
      }

      words.push(word);
    }

    return words;
  }
```

So basically what I am doing is I first created the array of letters and `semicolonFrequency` will add semicolon in between so I am adding one word at a time in while loop and in each loop I am choosing letter and add those letter to form a word in between I try to add ; to it using `Math.random()` logic So it simple go throught the code and you understand it completely

<br/>
<br/>
Now Focus on words in easy and medium mode because words colour are changing, So What I'm doing is I am assigning each word a class whether after user styed in input box

```js
function getWordClass(wordIdx) {
    if (difficulty === Difficulty.MEDIUM) {
      if (wordIdx === currWordIndex && status === "started") {
        return "is-blue";
      } else if (wordIdx < currWordIndex) {
        return "is-grey";
      }
    } else if (difficulty === Difficulty.EASY) {
      const currentWord = words[wordIdx];
      const typedWord = currInput.trim();

      if (wordIdx === currWordIndex) {
        if (typedWord.length === 0) {
          return "";
        } else if (currentWord.startsWith(typedWord)) {
          return "is-green";
        } else {
          return "is-red";
        }
      } else {
        return "is-grey";
      }
    } else {
      return "";
    }
  }
  ```
  in medium mode its easy it assigns two colours ie. blue and grey it checking through the index of words as all words are stored in the array itself and in easy we are just checking using startwith method so if word matches it assign green color class and if not it assign red colour class to it. otherwise grey colour class and for history there is seperate `useState` for storing history
  basically what I am doing is when I change the input of input box `<input onKeyDown={handleKeyDown} value={currInput} onChange={(e) => setCurrInput(e.target.value.trim())}` I am handling onKeyDown so it simply track the keypress and detail about keypress so
  ```js
  function handleKeyDown({ keyCode, key }) {
    // space bar
    if (keyCode === 32) {
      checkMatch();
      setCurrInput("");
      setCurrWordIndex(currWordIndex + 1);
      setCurrCharIndex(-1);
      // backspace
    } else if (keyCode === 8) {
      setCurrCharIndex(currCharIndex - 1);
      setCurrChar("");
    } else {
      setCurrCharIndex(currCharIndex + 1);
      setCurrChar(key);
    }
  }
  ```
  
  its maintaing the currInput state and handle space as words are removed after every space  clicked and `onChnage` handle the chage of input box and we are storing words with its class name in history useState so for rendering the words which is stored in history useState again we have a seperate function
  ```js
  function checkMatch() {
    const wordToCompare = words[currWordIndex];
    const doesItMatch = wordToCompare === currInput.trim();
    if (doesItMatch) {
      setCorrect(correct + 1);
      setHistory((prevHistory) => [
        ...prevHistory,
        { word: wordToCompare, isCorrect: true },
      ]);
    } else {
      setIncorrect(incorrect + 1);
      setHistory((prevHistory) => [
        ...prevHistory,
        { word: wordToCompare, isCorrect: false },
      ]);
    }
  }
  ```
Simply it check matched and set the className according to the matched words.


<br/>
<br/>
<br/>
<br/>
# Getting Started with Create React App

I will soon update the readme file
This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
