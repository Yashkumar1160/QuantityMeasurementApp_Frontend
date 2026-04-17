export interface QuantityDTO {
  value: number;
  unitName: string;
  measurementType: string;
}

export interface QuantityInputRequest {
  thisQuantityDTO: QuantityDTO;
  thatQuantityDTO: QuantityDTO;
}

export interface ConvertRequest {
  thisQuantityDTO: QuantityDTO;
  targetUnit: string;
}

export interface ArithmeticRequest {
  thisQuantityDTO: QuantityDTO;
  thatQuantityDTO: QuantityDTO;
  targetUnit: string;
}

export interface QuantityResponse {
  thisValue?:            number;
  thisUnit?:             string;
  thisMeasurementType?:  string;
  thatValue?:            number;
  thatUnit?:             string;
  thatMeasurementType?:  string;
  operation?:            string;
  resultValue?:          number;
  resultUnit?:           string;
  resultMeasurementType?: string;
  resultString?:         string;
  isError:               boolean;
  errorMessage?:         string;
  createdAt?:            string; 
}

export const UNITS: Record<string, string[]> = {
  Length:      ['Feet', 'Inch', 'Yard', 'Centimeter'],
  Weight:      ['Kilogram', 'Gram', 'Pound'],
  Volume:      ['Litre', 'Millilitre', 'Gallon'],
  Temperature: ['Celsius', 'Fahrenheit', 'Kelvin'],
};

export const MEASUREMENT_TYPES = ['Length', 'Weight', 'Volume', 'Temperature'];
export const OPERATIONS        = ['Compare', 'Convert', 'Add', 'Subtract', 'Divide'];