class ComplexNumber {
  constructor(public real: number, public imag: number) {}

  add(other: ComplexNumber) {
    return new ComplexNumber(this.real + other.real, this.imag + other.imag);
  }

  subtract(other: ComplexNumber) {
    return new ComplexNumber(this.real - other.real, this.imag - other.imag);
  }

  multiply(other: ComplexNumber) {
    const realPart = this.real * other.real - this.imag * other.imag;
    const imagPart = this.real * other.imag + this.imag * other.real;
    return new ComplexNumber(realPart, imagPart);
  }

  conjugate() {
    return new ComplexNumber(this.real, -this.imag);
  }

  scale(factor: number) {
    return new ComplexNumber(this.real * factor, this.imag * factor);
  }

  abs() {
    return Math.sqrt(this.real ** 2 + this.imag ** 2);
  }
}


export default ComplexNumber;