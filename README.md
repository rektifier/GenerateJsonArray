# GenerateJsonArray - a super simple JSON Template Processor

This script dynamically processes a JSON template file by replacing specific placeholders with dynamically generated values and writes the results to an output file. It supports generating multiple objects based on the template.

## Features
1. Replace placeholders dynamically with:
   - `$index`: A 1-based counter for the current iteration.
   - `$guid`: A globally unique identifier (GUID).
   - `$alternate[<values>]`: Alternate values from a list based on the current index.
2. Validate the resulting JSON after placeholder replacement.
3. Supports configuration through the number of desired output objects passed as a command-line argument.

## Input and Output
- **Input**: Reads a template from `input.json`.
- **Output**: Writes the resulting array of processed objects to `output.json`.

## How to Run
1. Place your JSON template in a file.
2. Run the script using:
   ```bash
   node generateJsonArray.js <number_of_items> <input_file>
   ```
   - `<number_of_items>`: The number of objects to generate (default: 5).
   - `<input_file>`: The name of the input file (default: `input.json`).
3. The generated JSON objects will be written to `output.json`.

## Placeholder Descriptions
- **`$index`**: Replaced with the 1-based index of the current iteration.
- **`$guid`**: Generates a unique identifier in the format `xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx`.
- **`$alternate[<values>]`**: Alternates between values inside the brackets.  
  Example:  
  - `$alternate[test1,test2]` will alternate between `test1` and `test2` across iterations.
  - Strings and integers can be used as values, and quoted strings are also supported.

## Template Example
```
{
    "alternate_strings": "$alternate['Foo, 01','Foo, 2']",
    "alternate_names": "$alternate[Bar1,Bar2]",
    "counter_string": "$index",
    "counter_int": $index,
    "guid": "$guid",
    "alternate_int_as_string": "$alternate[1,2,3]",
    "alternate_int": $alternate[1,2]
}
```

## Example Output (First 2 Iterations)
```json
[
    {
        "alternate_strings": "Foo, 01",
        "alternate_names": "Bar1",
        "counter_string": "1",
        "counter_int": 1,
        "guid": "3f6f6a5d-d59c-4e77-a7df-7f48f8947c85",
        "alternate_int_as_string": "1",
        "alternate_int": 1
    },
    {
        "alternate_strings": "Foo, 2",
        "alternate_names": "Bar2",
        "counter_string": "2",
        "counter_int": 2,
        "guid": "b9a7b1e5-3c3e-4323-88c7-fb8f80d62399",
        "alternate_int_as_string": "2",
        "alternate_int": 2
    }
]
```

## Error Handling
- If the processed text is not valid JSON, the error is logged, and that iteration is skipped.
- All unexpected errors are caught and logged.

## Dependencies
- Node.js `fs` module for file operations.

