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
    // sp.read(buffer: Buffer, offset: number, length: number): Promise<{buffer: Buffer, bytesRead: number}>
    // sp.write(buffer: Buffer): Promise<void>
  } finally {
    await sp.close()
  }
})

async function openSerialPort () {
  const availablePorts = SerialPort.list()
  console.info('AvailablePorts')
  availablePorts.forEach(port => console.info(port))

  const sp = new SerialPort({
    path: "/dev/ttys0",
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
    port.on('error', e => reject(e))
    port.on('open', () => resolve(sp))
  })
}
