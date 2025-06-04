const assert = require('assert');
const fs = require('fs');
const OpenAI = require('openai');

const generateImage = async () => {
  const openai = new OpenAI();
  const response = await openai.responses.create({
    model: 'gpt-4.1-nano',
    input:
      'Generate a picture of a cat of random color and breed in a random city in any parts of the world. Also include a description where an geo expert tries to guess the location of that random city.',
    tools: [{ type: 'image_generation' }],
  });

  const imgResponse = response.output.find((item) => item.type === 'image_generation_call');
  assert.ok(imgResponse, 'Image response is required.');

  const filename = `images/cat-${imgResponse.id}.jpg`;

  const imageBase64 = imgResponse.result;
  fs.writeFileSync(filename, Buffer.from(imageBase64, 'base64'));

  // Feed it back to ai for expert guess
  const guessResponse = await openai.responses.create({
    model: 'gpt-4.1-nano',
    input: [
      {
        role: 'user',
        content: [
          {
            type: 'input_text',
            text: 'As a cat expert and a travel expert, where does this image of a cat likely come from? Describe the location, region, or possible country based on visual clues.',
          },
          {
            type: 'input_image',
            image_url: `data:image/jpeg;base64,${imageBase64}`,
          },
        ],
      },
    ],
  });

  return {
    imageUrl: `/${filename}`,
    expertDescription: guessResponse.output_text,
  };
};

module.exports = {
  generateImage,
};
