class AudioStreamLoader {
  private stream: ReadableStream<Uint8Array> | undefined;
  private reader: ReadableStreamDefaultReader<Uint8Array> | undefined;
  private sourceBuffer: SourceBuffer | undefined;
  private mediaSource: MediaSource | undefined;
  private audio: HTMLAudioElement = new Audio();
  constructor(stream: ReadableStream<Uint8Array>) {
    this.stream = stream;
    this.loadProcess();
  }
  private loadProcess(): void {
    console.log('loadProcess');
    this.mediaSource = new MediaSource();
    // this.audio =
    this.audio.src = URL.createObjectURL(this.mediaSource);

    this.mediaSource.addEventListener('sourceopen', this.onSourceOpen.bind(this));
  }

  // Function for adding data to SourceBuffer
  private appendToBuffer(data: Uint8Array) {
    if (!this.sourceBuffer) {
      return;
    }
    // if (!this.sourceBuffer.updating) {
    this.sourceBuffer.appendBuffer(data);
    // } else {
    // setTimeout(() => this.appendToBuffer(data), 10); // Retry after a short period of time
    // }
  }

  // Function for reading and processing the data stream
  private process({ done, value }: ReadableStreamReadResult<Uint8Array>) {
    if (!this.mediaSource) {
      return;
    }
    if (!this.reader) {
      return;
    }
    if (done) {
      this.mediaSource.endOfStream();
      return;
    }
    this.appendToBuffer(value);
    // this.reader.read().then(this.process.bind(this));
  }

  private async syncWithUpatingEndSourceBuffer(): Promise<void> {
    if (!this.sourceBuffer) {
      return;
    }
    if (this.sourceBuffer.updating) {
      await new Promise((resolve) => {
        this.sourceBuffer?.addEventListener('updateend', () => {
          console.log('updateend');
          resolve(null);
        });
      });
      console.log('continue updateend');
    }
  }

  private onSourceOpen(): void {
    (async () => {
      console.log('onSourceOpen');
      if (!this.stream) {
        return;
      }
      if (!this.mediaSource) {
        return;
      }
      console.log('onSourceOpen continue');
      this.sourceBuffer = this.mediaSource.addSourceBuffer('audio/mpeg'); // Specify MIME type
      this.reader = this.stream.getReader();

      // Start reading the data stream
      let readResult = await this.reader.read(); // .then(this.process.bind(this));
      while (!readResult.done) {
        console.log('readStream:', readResult.value.length);
        await this.syncWithUpatingEndSourceBuffer();
        this.sourceBuffer.appendBuffer(readResult.value);

        readResult = await this.reader.read();
      }
      this.mediaSource.endOfStream();
    })();
  }

  public getAudio(): HTMLAudioElement {
    return this.audio;
  }
}

export { AudioStreamLoader };
