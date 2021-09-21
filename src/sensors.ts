export interface SensorData {
  humidity: number;
  temperature: number;
}

export const getSensors = async (): Promise<SensorData> => {
  // TODO Get better sensor data
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  return { humidity: Date.now() % 13, temperature: Date.now() % 37 } as SensorData;
}
