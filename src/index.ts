import { ElevenLabsClient, BodyAddAPronunciationDictionaryV1PronunciationDictionariesAddFromFilePost, PronunciationDictionary } from "elevenlabs";
import * as fs from "fs";

async function main() {
    // Initialize ElevenLabs client
    const elevenlabs = new ElevenLabsClient({
        apiKey: "YOUR_API_KEY"
    });

    // Step 1: Create a pronunciation dictionary from a file
    const fileStream = fs.createReadStream("/path/to/tomato_pronunciation.pls");
    const pronunciationRequest: BodyAddAPronunciationDictionaryV1PronunciationDictionariesAddFromFilePost = {
        name: "TomatoPronunciation",
        description: "Pronunciation guide for tomato and Tomato."
    };

    const dictionaryResponse = await elevenlabs.pronunciationDictionary.addFromFile(
        fileStream,
        pronunciationRequest
    );

    console.log("Pronunciation Dictionary ID:", dictionaryResponse.id);

    // Step 2: Play "tomato" using the created pronunciation dictionary with the voice "Rachel"
    let audio = await elevenlabs.generate({
        voice: "Rachel",
        text: "tomato",
        pronunciationDictionaryId: dictionaryResponse.id,
    });

    play(audio);

    // Step 3: Remove the "tomato" rule from the pronunciation dictionary
    const removeRequest = {
        rule_strings: ["tomato", "Tomato"],
    };

    await elevenlabs.pronunciationDictionary.removeRulesFromThePronunciationDictionary(
        dictionaryResponse.id,
        removeRequest
    );

    console.log("Removed 'tomato' rule from dictionary.");

    // Play "tomato" again after removing the rule
    audio = await elevenlabs.generate({
        voice: "Rachel",
        text: "tomato",
        pronunciationDictionaryId: dictionaryResponse.id,
    });

    play(audio);

    // Step 4: Add the "tomato" rule again using its phoneme
    const addRulesRequest: PronunciationDictionary = {
        rules: [
            {
                string_to_replace: "tomato",
                phoneme: "təˈmeɪtoʊ",
                type: "phoneme",
                alphabet: "ipa"
            },
            {
                string_to_replace: "Tomato",
                phoneme: "təˈmeɪtoʊ",
                type: "phoneme",
                alphabet: "ipa"
            }
        ]
    };

    await elevenlabs.pronunciationDictionary.addRulesToThePronunciationDictionary(
        dictionaryResponse.id,
        addRulesRequest
    );

    console.log("Added 'tomato' rule again to dictionary.");

    // Step 5: Play "tomato" again with the updated pronunciation dictionary
    audio = await elevenlabs.generate({
        voice: "Rachel",
        text: "tomato",
        pronunciationDictionaryId: dictionaryResponse.id,
    });

    play(audio);
}

function play(audio: any) {
    console.log("Playing audio:", audio);
}

main().catch(console.error);
