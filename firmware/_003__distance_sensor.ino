class HC_SR04 {
    public:
        HC_SR04(char* init_name, int init_pin_trig, int init_pin_echo) {
            strcpy(this->name, init_name);
            this->pin_trig = init_pin_trig;
            this->pin_echo = init_pin_echo;
            pinMode(this->pin_trig, OUTPUT);
            digitalWrite(this->pin_trig, LOW);
            delayMicroseconds(2); 
            pinMode(this->pin_echo, INPUT);
        };
    
        char* getName() {
            return this->name;
        }
    
        void trigger() {
            digitalWrite(this->pin_trig, HIGH);
            delayMicroseconds(10); 
            digitalWrite(this->pin_trig, LOW);
        }
    
        int echo() {
            this->duration = pulseIn(this->pin_echo, HIGH);
            return this->duration;
        }
    
        float measure() {
            // - speed of sound is 343,4 m/s or 0,0343 cm/microsecond to the Temperature of 20°C
            // - we divide for 2 because the duration is the time spent from ultrasonic signal to sending and returning:
            // - 0,0343/2 = 0,01715 = 1/58,31 
            this->distance = this->duration/58.0;
            return this->distance;
        }
    
        int getDuration() {
            return this->duration;
        }
    
        float getDistance() {
            return this->distance;
        }
  
    private:
        char name[16];
        int pin_trig;
        int pin_echo;
        int duration;
        float distance;
};

HC_SR04* dist_sens_0;
HC_SR04* dist_sens_1;

void setISR0() {
    noInterrupts();
    timer0_isr_init();
    timer0_attachInterrupt(timer0_ISR);
    timer0_write(ESP.getCycleCount() + 8000000L);
    interrupts();
}

void timer0_ISR(void) {
    dist_sens_0->trigger();
    dist_sens_0->echo();
    dist_sens_1->trigger();
    dist_sens_1->echo();
  
    if (dist_sens_0->measure() >= 30.00) {
        serialPrint(dist_sens_0->getName(), 0.00); 
    } else {
        serialPrint(dist_sens_0->getName(), dist_sens_0->getDistance()); 
    }
  
    if (dist_sens_1->measure() >= 30.00) {
        serialPrint(dist_sens_1->getName(), 0.00); 
    } else {
        serialPrint(dist_sens_1->getName(), dist_sens_1->getDistance()); 
    }
    
    delay(100);
    timer0_write(ESP.getCycleCount() + 8000000L); // 8MHz == 0.1sec
}


void serialPrint(char* name, float value) {
    Serial.print(name);
    Serial.print(":");
    Serial.print(value);
    Serial.print(";");
}

void setup() {
    Serial.begin(19200);
    Serial.println("[INITIALIZING]");
    dist_sens_0 = new HC_SR04("S1", 2, 14);
    dist_sens_1 = new HC_SR04("S2", 12, 13);
    delay(6000);
    setISR0();
}

void loop() {}

int main(void) {
    setup();
    while(1) {
        loop();
    }
}
