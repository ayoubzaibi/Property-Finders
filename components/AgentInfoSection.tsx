import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface AgentInfoSectionProps {
  agentName?: string;
  agentPhone?: string;
  agentEmail?: string;
  openPhone?: () => void;
  openEmail?: () => void;
}

export default function AgentInfoSection({
  agentName = 'zaibi Aberafie',
  agentPhone = '',
  agentEmail = '',
  openPhone,
  openEmail,
}: AgentInfoSectionProps) {
  return (
    <View style={styles.agentSection}>
      <Text style={styles.sectionTitle}>Agent Information</Text>
      {agentName ? (
        <Text style={styles.agentText}>Name: {agentName}</Text>
      ) : (
        <Text style={styles.agentText}>Name: Zaibi Aberafie</Text>
      )}
      {agentPhone ? (
        <Text style={styles.agentText}>Phone: {agentPhone}</Text>
      ) : (
        <Text style={styles.agentText}>Phone: 99 45 45 05</Text>
      )}
      {agentEmail ? (
        <Text style={styles.agentText}>Email: {agentEmail}</Text>
      ) : (
        <Text style={styles.agentText}>Email: zaibi.abderafie@gmail.com</Text>
      )}
      <View style={styles.agentButtons}>
        {agentPhone && (
          <TouchableOpacity
            style={styles.contactBtn}
            onPress={openPhone}
            accessibilityLabel="Call agent"
            accessibilityRole="button"
          >
            <Ionicons name="call" size={20} color="#fff" />
          </TouchableOpacity>
        )}
        {agentEmail && (
          <TouchableOpacity
            style={styles.contactBtn}
            onPress={openEmail}
            accessibilityLabel="Email agent"
            accessibilityRole="button"
          >
            <Ionicons name="mail" size={20} color="#fff" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  agentSection: {
    marginTop: 24,
    padding: 12,
    backgroundColor: "#f6f2fa",
    borderRadius: 12,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#a2cbe8ff",
    marginBottom: 8,
  },
  agentText: { fontSize: 14, color: "#444", marginBottom: 4 },
  agentButtons: { flexDirection: "row", marginTop: 8 },
  contactBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#a2cbe8ff",
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginRight: 12,
  },
  contactBtnText: { color: "#fff", fontWeight: "600", marginLeft: 6 },
});
