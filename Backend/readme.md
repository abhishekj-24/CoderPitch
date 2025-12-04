{
  "title": "add two numbers",
  "description": "Given two numbers, return their sum.",
  "diffuclty": "easy",
  "tags": "array",
  "visibiletastcase": [
    {
      "input": "1, 2",
      "output": "3",
      "explanation": "Adding two positive integers"
    },
    {
      "input": "-5, 10",
      "output": "5",
      "explanation": "Adding negative and positive number"
    },
    {
      "input": "0, 0",
      "output": "0",
      "explanation": "Adding zeros"
    }
  ],
  "hiddentastcase": [
{
"input": "1000000000, 2000000000",
"output": "3000000000"
},
{
"input": "-15, -25",
"output": "-40"
}
],
  "startcode": [
    {
      "language": "c++",
      "initialcode": "#include <iostream>\nusing namespace std;\n\nint main() {\n    int a, b;\n    cin >> a >> b;\n    // Write your code here\n    return 0;\n}"
    },
    {
      "language": "java",
      "initialcode": "import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int a = sc.nextInt();\n        int b = sc.nextInt();\n        // Write your code here\n    }\n}"
    },
    {
      "language": "javascript",
      "initialcode": "process.stdin.on('data', (data) => {\n    const input = data.toString().split(' ');\n    const a = parseInt(input[0]);\n    const b = parseInt(input[1]);\n    // Write your code here\n});"
    }
  ],
  "referencesol": [
    {
      "language": "c++",
      "completeCode": "#include <iostream>\nusing namespace std;\n\nint main() {\n    int a, b;\n    cin >> a >> b;\n    cout << a + b;\n    return 0;\n}"
    },
    {
      "language": "java",
      "completeCode": "import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        System.out.println(sc.nextInt() + sc.nextInt());\n    }\n}"
    },
    {
      "language": "javascript",
      "completeCode": "process.stdin.on('data', (data) => {\n    const input = data.toString().split(' ').map(Number);\n    console.log(input[0] + input[1]);\n});"
    }
  ]
}

const user = await User.findById(userId).populate({
            path:'problemsolved',
            select:'_id title tags diffuclty'
        })


populate give power to direct acceess the db of that schema refer 
