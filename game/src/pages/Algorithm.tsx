import { useState } from 'react'

export default function Algorithm(){

    const words = ["abacate", "aviao", "assistencia", "assento"]
    const [wordsPrefix, setWordsPrefix] = useState<string[]>([]);
    const [wordsSuffix, setWordsSuffix] = useState<string[]>(words);

    const handleChange = (e: any) => {
        const word = e.target.value

        let newWordsPrefixState : string[] = []
        let newWordsSuffixState : string[] = []

        let index = 0;
        for(let wordCurrent of words) {
            if( words[index].substring(0, word.length) == word ){
                newWordsPrefixState.push(word)
                newWordsSuffixState.push(words[index].substring(word.length, wordCurrent.length))
            }
            else{
                newWordsPrefixState.push("")
                newWordsSuffixState.push(words[index])
            }
            index = index + 1;
        }

        setWordsPrefix(newWordsPrefixState);
        setWordsSuffix(newWordsSuffixState);

    }

    return (
        <div style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            width: "100vw",
            height: "100vh",
            backgroundColor: "#0c4a6e"
        }}>
            <div style={{ fontSize: "2rem" }}>
                {
                    words.map((_, index) => {
                        return <div>
                                <span style={{color: "green"}}>{wordsPrefix[index]}</span><span>{wordsSuffix[index]}</span>
                        </div>
                    })
                }
            </div>
            <input
                style={{
                    padding: "1rem 3rem",
                    borderRadius: "10px",
                    color: "black",
                    fontSize: "2rem"
                }}
                onChange={handleChange}
            />
        </div>
    );
}