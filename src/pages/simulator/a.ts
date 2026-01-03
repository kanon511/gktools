self.onmessage = (e: MessageEvent<number[]>) => {
    const data = e.data
    const result = data.reduce((acc, cur) => acc + cur, 0)
    self.postMessage(result)
}