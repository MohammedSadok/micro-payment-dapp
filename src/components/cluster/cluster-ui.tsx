"use client";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useConnection } from "@solana/wallet-adapter-react";
import { Connection } from "@solana/web3.js";
import { useQuery } from "@tanstack/react-query";
import { ReactNode, useState } from "react";
import { AppModal } from "../ui/ui-layout";
import { ClusterNetwork, useCluster } from "./cluster-data-access";

export function ExplorerLink({
  path,
  label,
  className,
}: {
  path: string;
  label: string;
  className?: string;
}) {
  const { getExplorerUrl } = useCluster();
  return (
    <a
      href={getExplorerUrl(path)}
      target="_blank"
      rel="noopener noreferrer"
      className={className ? className : `link font-mono`}
    >
      {label}
    </a>
  );
}

export function ClusterChecker({ children }: { children: ReactNode }) {
  const { cluster } = useCluster();
  const { connection } = useConnection();

  const query = useQuery({
    queryKey: ["version", { cluster, endpoint: connection.rpcEndpoint }],
    queryFn: () => connection.getVersion(),
    retry: 1,
  });
  if (query.isLoading) {
    return null;
  }
  if (query.isError || !query.data) {
    return (
      <div className="alert alert-warning text-warning-content/80 rounded-none flex justify-center">
        <span>
          Error connecting to cluster <strong>{cluster.name}</strong>
        </span>
        <button
          className="btn btn-xs btn-neutral"
          onClick={() => query.refetch()}
        >
          Refresh
        </button>
      </div>
    );
  }
  return children;
}

export function ClusterUiSelect() {
  const { clusters, setCluster, cluster } = useCluster();
  return (
    <Select
      value={cluster.name}
      onValueChange={(value) => {
        const selectedCluster = clusters.find((c) => c.name === value);
        if (selectedCluster) setCluster(selectedCluster);
      }}
    >
      <SelectTrigger className="w-[200px]">
        <SelectValue>{cluster.name}</SelectValue>
      </SelectTrigger>
      <SelectContent className="bg-white">
        <SelectGroup>
          {clusters.map((item) => (
            <SelectItem
              key={item.name}
              value={item.name}
              className={`${
                item.active ? "bg-gray-100 font-medium" : ""
              } text-gray-800`}
            >
              {item.name}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}

export function ClusterUiModal({
  hideModal,
  show,
}: {
  hideModal: () => void;
  show: boolean;
}) {
  const { addCluster } = useCluster();
  const [name, setName] = useState("");
  const [network, setNetwork] = useState<ClusterNetwork | undefined>();
  const [endpoint, setEndpoint] = useState("");

  return (
    <AppModal
      title={"Add Cluster"}
      hide={hideModal}
      show={show}
      submit={() => {
        try {
          new Connection(endpoint);
          if (name) {
            addCluster({ name, network, endpoint });
            hideModal();
          } else {
            console.log("Invalid cluster name");
          }
        } catch {
          console.log("Invalid cluster endpoint");
        }
      }}
      submitLabel="Save"
    >
      <input
        type="text"
        placeholder="Name"
        className="input input-bordered w-full"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="text"
        placeholder="Endpoint"
        className="input input-bordered w-full"
        value={endpoint}
        onChange={(e) => setEndpoint(e.target.value)}
      />
      <select
        className="select select-bordered w-full"
        value={network}
        onChange={(e) => setNetwork(e.target.value as ClusterNetwork)}
      >
        <option value={undefined}>Select a network</option>
        <option value={ClusterNetwork.Devnet}>Devnet</option>
        <option value={ClusterNetwork.Testnet}>Testnet</option>
        <option value={ClusterNetwork.Mainnet}>Mainnet</option>
      </select>
    </AppModal>
  );
}

export function ClusterUiTable() {
  const { clusters, setCluster, deleteCluster } = useCluster();
  return (
    <div className="overflow-x-auto">
      <table className="table border-4 border-separate border-base-300">
        <thead>
          <tr>
            <th className="text-gray-800">Name/ Network / Endpoint</th>
            <th className="text-center text-gray-800">Actions</th>
          </tr>
        </thead>
        <tbody>
          {clusters.map((item) => (
            <tr key={item.name} className={item?.active ? "bg-gray-100" : ""}>
              <td className="space-y-2">
                <div className="whitespace-nowrap space-x-2">
                  <span className="text-xl text-gray-800">
                    {item?.active ? (
                      item.name
                    ) : (
                      <button
                        className="bg-white hover:bg-gray-100 text-gray-800 border border-gray-300 px-4 py-2 rounded"
                        onClick={() => setCluster(item)}
                      >
                        {item.name}
                      </button>
                    )}
                  </span>
                  <select className="select select-sm bg-white text-gray-800 border border-gray-300">
                    <option>{item.network}</option>
                  </select>
                  <span className="text-gray-600">{item.endpoint}</span>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
