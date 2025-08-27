class SampleEventTemplate {
  constructor(eventCode, template) {
    this.eventCode = eventCode;
    this.template = template;
  }

  toString() {
    return JSON.stringify(this.template, null, 2);
  }

  toBase64() {
    return Buffer.from(JSON.stringify(this.template)).toString("base64");
  }
}

module.exports = {
  SampleEventTemplate,
};
