export class CRDTObject {
  id?: string;
  createdOn?: {
    value: Date;
    timestamp: number;
  };
  updatedOn?: {
    value: Date;
    timestamp: number;
  };
  createdBy?: {
    value: string;
    timestamp: number;
  };

  constructor(id?: string) {
    this.id = id;
  }

  private getLastWriterWins<T extends BaseObject>(field: keyof CRDTObject): T['value'] {
    return (this as any)[field]?.timestamp > (this as any).replica[field]?.timestamp
      ? (this as any)[field]?.value
      : (this as any).replica[field]?.value;
  }

  merge(replica: CRDTObject): void {
    const fields: (keyof CRDTObject)[] = ["createdOn", "updatedOn", "createdBy"];

    fields.forEach((field) => {
      (this as any)[field] = {
        value: this.getLastWriterWins<BaseObject>(field as keyof CRDTObject),
        timestamp: Math.max((this as any)[field]?.timestamp ?? 0, (replica as any)[field]?.timestamp ?? 0),
      };
    });
  }
}

class BaseObject { value: any; timestamp: number }


// Assuming you have two replicas, replica1 and replica2

const replica1 = new CRDTObject("someId");
replica1.createdOn = {
  value: new Date(),
  timestamp: Date.now(),
};
replica1.updatedOn = {
  value: new Date(),
  timestamp: Date.now(),
};
replica1.createdBy = {
  value: "user1",
  timestamp: Date.now(),
};

const replica2 = new CRDTObject("someId");
replica2.createdOn = {
  value: new Date(),
  timestamp: Date.now(),
};
replica2.updatedOn = {
  value: new Date(),
  timestamp: Date.now(),
};
replica2.createdBy = {
  value: "user2",
  timestamp: Date.now(),
};

// Merge the replicas using Last-Writer-Wins strategy
replica1.merge(replica2);

// After merging, you get the merged state
console.log(replica1);