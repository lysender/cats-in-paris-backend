const fs = require('fs');
const OpenAI = require('openai');

const generateImage = async () => {
  const client = new OpenAI();
  const img = await client.images.generate({
    model: 'gpt-image-1',
    prompt: 'Generate a picture of a cat of random color and breed in a random city in any parts of the world.',
    n: 1,
    size: '1024x1024',
    quality: 'medium',
    output_format: 'jpeg',
  });

  const filename = `images/cat-${img.created}.jpg`;

  const imgBuffer = Buffer.from(img.data[0].b64_json, 'base64');
  fs.writeFileSync(filename, imgBuffer);

  // Feed it back to ai for expert guess
  const guessResponse = await client.responses.create({
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
            image_url: `data:image/jpeg;base64,${img.data[0].b64_json}`,
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
