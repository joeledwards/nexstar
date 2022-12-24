#! /usr/bin/env node

const app = require('@buzuli/app')
const { SerialPort } = require('serialport')

app(async () => {
  console.info("NexStar Serial Controller")

  const sp = await openSerialPort()
  console.info('Ready')

  try {
    // https://serialport.io/docs/api-bindings-cpp
    //
    // sp.write(buffer: Buffer): Promise<void>
    // sp.read(buffer: Buffer, offset: number, length: number): Promise<{buffer: Buffer, bytesRead: number}>

    console.info('Requesting info')
    sp.write(Buffer.from(`Get RA/DEC\r`))
    await sleep(3500)
    console.info('Reading info')
    const b = Buffer.alloc(64)
    sp.read(b, 10)
    console.info(b)
  } finally {
    console.info("Closing serial port.")
    await sp.close()
  }
})

async function openSerialPort () {
  const availablePorts = await SerialPort.list()
  //console.info('AvailablePorts')
  //availablePorts.forEach(port => console.info(port))

  const sp = new SerialPort({
    path: "/dev/ttyUSB0",
    baudRate: 9600,
    dataBits: 8,
    lock: true,
    stopBits: 1,
    parity: false,
    rtscts: false,
    xon: false,
    xany: false,
    hupcl: true,
  })

  return new Promise((resolve, reject) => {
    sp.on('error', e => reject(e))
    sp.on('open', () => resolve(sp))
  })
}

async function sleep (duration) {
  return new Promise(resolve => setTimeout(resolve, duration))
}
