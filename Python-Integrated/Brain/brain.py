#step1: setup GROQ API key
from dotenv import load_dotenv
load_dotenv()

import os
GROQ_API_KEY=os.environ.get("GROQ_API_KEY")

#step2: convert image to required format
import base64

#This function takes the image,read its binary ..convert it into bytes format which then converted into a proper text format
def encode_image(image_path):
    image_file=open(image_path,"rb")
    return base64.b64encode(image_file.read()).decode("utf-8")

#step3: setup Multimodel LLM
from groq import Groq

def analyze_image_with_query(query, model, encoded_image):
    client = Groq(api_key=GROQ_API_KEY)

    messages = [
        {
            "role": "user",
            "content": [
                {
                    "type": "text",
                    "text": query
                },
                {
                    "type": "image_url",
                    "image_url": {
                        "url": f"data:image/webp;base64,{encoded_image}",
                    },
                }
            ]
        }
    ]

    # Enable streaming
    response = client.chat.completions.create(
        messages=messages,
        model=model,
        stream=True  # ← This enables streaming
    )

    # Accumulate streamed tokens
    full_response = ""
    for chunk in response:
        if chunk.choices[0].delta.content:
            # print(chunk.choices[0].delta.content, end="", flush=True)  # Optional: live printing
            full_response += chunk.choices[0].delta.content

    return full_response
