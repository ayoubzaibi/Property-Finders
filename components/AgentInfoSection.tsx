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
  agentName,
  agentPhone,
  agentEmail,
  openPhone,
  openEmail,
}: AgentInfoSectionProps) {
  if (!agentName && !agentPhone && !agentEmail) return null;
  return (
    <View style={styles.agentSection}>
      <Text style={styles.sectionTitle}>Agent Information</Text>
      {agentName && <Text style={styles.agentText}>Name: {agentName}</Text>}
      {agentPhone && <Text style={styles.agentText}>Phone: {agentPhone}</Text>}
      {agentEmail && <Text style={styles.agentText}>Email: {agentEmail}</Text>}
      <View style={styles.agentButtons}>
        {agentPhone && (
          <TouchableOpacity
            style={styles.contactBtn}
            onPress={openPhone}
            accessibilityLabel="Call agent"
            accessibilityRole="button"
          >
            <Ionicons name="call" size={20} color="#fff" />
            <Text style={styles.contactBtnText}>Call</Text>
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
            <Text style={styles.contactBtnText}>Email</Text>
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
    color: "#764ba2",
    marginBottom: 8,
  },
  agentText: { fontSize: 14, color: "#444", marginBottom: 4 },
  agentButtons: { flexDirection: "row", marginTop: 8 },
  contactBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#764ba2",
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginRight: 12,
  },
  contactBtnText: { color: "#fff", fontWeight: "600", marginLeft: 6 },
});
