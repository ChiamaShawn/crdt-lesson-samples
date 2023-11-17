import java.util.HashMap;
import java.util.Map;

public class CounterCRDT {
    private final String nodeId;
    private Map<String, Integer> state;

    public CounterCRDT(String nodeId) {
        this.nodeId = nodeId;
        this.state = new HashMap<>();
    }

    public void increment() {
        state.put(nodeId, state.getOrDefault(nodeId, 0) + 1);
    }

    public void decrement() {
        state.put(nodeId, state.getOrDefault(nodeId, 0) - 1);
    }

    public int getValue() {
        int sum = 0;
        for (int value : state.values()) {
            sum += value;
        }
        return sum;
    }

    public void merge(CounterCRDT other) {
        for (Map.Entry<String, Integer> entry : other.state.entrySet()) {
            String otherNodeId = entry.getKey();
            int otherValue = entry.getValue();
            state.put(otherNodeId, Math.max(state.getOrDefault(otherNodeId, 0), otherValue));
        }
    }

    public static void main(String[] args) {
        // Example usage
        CounterCRDT replica1 = new CounterCRDT("node1");
        CounterCRDT replica2 = new CounterCRDT("node2");

        replica1.increment();
        replica1.increment();
        replica2.decrement();

        // Merge the states
        replica1.merge(replica2);
        replica2.merge(replica1);

        // Print the final values
        System.out.println("Replica 1 value: " + replica1.getValue()); // Expected output: 1
        System.out.println("Replica 2 value: " + replica2.getValue()); // Expected output: 1
    }
}