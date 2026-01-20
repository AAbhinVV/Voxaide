const streamToBuffer = (stream) => {
  const chunks = []
  stream.on("data", (chunk) => chunks.push(chunk))

  return new Promise((resolve,reject) => {
    stream.on("end", () =>{
      const buffer = Buffer.concat(chunks)
      resolve(buffer)
    })

    stream.on("error", (err) => {
      reject(err)
    })
  })

}

export default streamToBuffer
