# Anwesenheitserkennung-Smarthome
Anwesenheitserkennung mithilfe eines ESP32 Bluetooth-Geräts und einem Raspberry Pi als zentraler Server für ein Smart Home-System. Die Anwesenheitserkennung ist eine grundlegende Komponente für die Automatisierung von Smart Homes, da sie es ermöglicht, Geräte und Aktionen basierend auf der An- oder Abwesenheit von Personen im Haus zu steuern.

Hauptmerkmale:

ESP32 Bluetooth-Anwesenheitssensor: Der ESP32 fungiert als Bluetooth-Scanner, der die Sichtbarkeit von Bluetooth-Geräten in der Nähe überwacht. Dies können beispielsweise die Smartphones der Bewohner sein. Die erfassten Daten werden an den Raspberry Pi-Server gesendet.

Raspberry Pi Smart Home Server: Der Raspberry Pi dient als zentraler Server, der die erfassten Daten vom ESP32 empfängt, verarbeitet und speichert. Er nutzt eine benutzerfreundliche Benutzeroberfläche zur Konfiguration und Anzeige der erkannten Anwesenheiten und stellt die Daten über das MQTT-Protokoll im Netzwerk zu verfügung.

Erkennung mittels IRK: Für eine IRK-basierte Registrierung von Apple-Geräten, um auch mit privaten zufälligen Adressen passiv eindeutig zu lokalisieren. Apple-Geräte geben verschiedene BLE-Kontinuitätsmeldungen aus und häufig wird der Fingerabdruck apple:100?:*- angezeigt. Wenn ein Haushalt über viele iPhones verfügt, kommt es leider irgendwann zu Kollisionen zwischen den nahegelegenen Informationen und zu doppelten Fingerabdrücken.

Um dies zu umgehen,wird der Remote-IRK (Identitätsauflösungsschlüssel) von Ihrem iOS- (iPhone) oder Watch OS-Gerät (Apple Watch) abgerufen und dieser dann in einer Datenbank auf dem Server gespeichert.



Datenverarbeitung: Wenn ein Gerät identifiziert wurde, wird der RSSI-Wert (empfangende Signalstärke) abgefragt. Diese Signalstärke der verschiedenen Sensoren dient als input für ein Neuronales Netz, diese giebt dann als Output die verschiedenen Räume mit der Wahrscheinlichtkeit der Anwesenheit aus. 
